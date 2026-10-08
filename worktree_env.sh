#!/usr/bin/env bash
# ==============================================================================
# JorgeBarcenaDev — Gestión de Entornos Aislados con Git Worktree & Docker
# ==============================================================================
# Permite crear entornos de desarrollo aislados con su propia rama de Git,
# directorio independiente y asignación automática de puertos libres para Docker.
#
# Uso:
#   ./worktree_env.sh create <nombre-rama> [--start]
#   ./worktree_env.sh list
#   ./worktree_env.sh remove <nombre-rama> [--keep-branch]
#   ./worktree_env.sh start <nombre-rama>
#   ./worktree_env.sh stop <nombre-rama>
# ==============================================================================

set -eo pipefail

BLUE="\033[94m"
CYAN="\033[96m"
GREEN="\033[92m"
YELLOW="\033[93m"
RED="\033[91m"
BOLD="\033[1m"
RESET="\033[0m"

REAL_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT")" && pwd)"

COMMON_GIT_DIR="$(git -C "$SCRIPT_DIR" rev-parse --git-common-dir 2>/dev/null || true)"
if [ -n "$COMMON_GIT_DIR" ]; then
    MAIN_REPO_DIR="$(cd "$SCRIPT_DIR" && cd "$COMMON_GIT_DIR/.." && pwd)"
else
    MAIN_REPO_DIR="$SCRIPT_DIR"
fi

# Verificar que estamos en un repositorio Git
if [ ! -d "$MAIN_REPO_DIR/.git" ] && [ ! -f "$MAIN_REPO_DIR/.git" ]; then
    echo -e "${RED}[ERROR]${RESET} Este script debe ejecutarse dentro de un repositorio Git."
    exit 1
fi

REPO_NAME="$(basename "$MAIN_REPO_DIR")"

# Determinar rama base por defecto (develop -> main -> master)
get_base_branch() {
    if git -C "$MAIN_REPO_DIR" show-ref --verify --quiet refs/heads/develop; then
        echo "develop"
    elif git -C "$MAIN_REPO_DIR" show-ref --verify --quiet refs/heads/main; then
        echo "main"
    else
        echo "master"
    fi
}

# Sanitiza nombre de rama a slug seguro para nombres de carpetas
sanitize_slug() {
    local input="$1"
    echo "$input" | tr '/@_.: ' '-' | tr -cd '[:alnum:]-' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

# Sanitiza slug para identificadores de Docker
sanitize_docker() {
    local input="$1"
    echo "$input" | tr '/@\-.: ' '_' | tr -cd '[:alnum:]_' | sed 's/__*/_/g' | sed 's/^_//;s/_$//' | tr '[:upper:]' '[:lower:]'
}

# Comprueba si un puerto TCP en localhost está en uso
is_port_in_use() {
    local port="$1"
    python3 -c "import socket, sys
s = socket.socket()
s.settimeout(0.4)
try:
    s.bind(('127.0.0.1', $port))
    s.close()
    sys.exit(1) # Libre
except OSError:
    sys.exit(0) # Ocupado
" >/dev/null 2>&1
    return $? # 0 = ocupado, 1 = libre
}

# Busca el siguiente puerto libre a partir de un puerto inicial
find_next_free_port() {
    local start_port="$1"
    local port="$start_port"
    local max_port=$((start_port + 200))

    while [ "$port" -le "$max_port" ]; do
        if ! is_port_in_use "$port"; then
            # Verificar si además está asignado en algún .env de otros worktrees
            local reserved=false
            for env_file in "$MAIN_REPO_DIR"/../*/.env; do
                if [ -f "$env_file" ] && grep -Eq "^PORT=.*$port" "$env_file" 2>/dev/null; then
                    reserved=true
                    break
                fi
            done
            if [ "$reserved" = false ]; then
                echo "$port"
                return 0
            fi
        fi
        port=$((port + 1))
    done

    echo -e "${RED}[ERROR]${RESET} No se encontró ningún puerto libre a partir de $start_port" >&2
    exit 1
}

# ------------------------------------------------------------------------------
# COMANDO: CREATE
# ------------------------------------------------------------------------------
cmd_create() {
    local branch_name="$1"
    local auto_start=false

    if [ -z "$branch_name" ] || [ "$branch_name" == "--help" ] || [ "$branch_name" == "-h" ]; then
        echo -e "${BOLD}Uso:${RESET} $0 create <nombre-rama> [--start]"
        echo -e "Crea una rama aislada y un worktree con puertos propios de Docker."
        exit 0
    fi

    if [ "$2" == "--start" ] || [ "$2" == "-s" ]; then
        auto_start=true
    fi

    local slug_folder
    slug_folder="$(sanitize_slug "$branch_name")"
    local slug_docker
    slug_docker="$(sanitize_docker "$branch_name")"

    local target_dir
    target_dir="$(cd "$MAIN_REPO_DIR/.." && pwd)/${REPO_NAME}_${slug_folder}"

    echo -e "\n${CYAN}${BOLD}======================================================${RESET}"
    echo -e "${CYAN}${BOLD}   CREACIÓN DE ENTORNO AISLADO (GIT WORKTREE)         ${RESET}"
    echo -e "${CYAN}${BOLD}======================================================${RESET}\n"

    echo -e "${BLUE}[INFO]${RESET} Rama objetivo      : ${BOLD}$branch_name${RESET}"
    echo -e "${BLUE}[INFO]${RESET} Directorio aislado : ${BOLD}$target_dir${RESET}"

    if [ -d "$target_dir" ]; then
        echo -e "${RED}[ERROR]${RESET} El directorio ya existe: $target_dir"
        echo -e "Si deseas eliminarlo, usa: $0 remove $branch_name"
        exit 1
    fi

    local base_branch
    base_branch="$(get_base_branch)"
    echo -e "${BLUE}[INFO]${RESET} Rama base          : ${BOLD}$base_branch${RESET}"

    # Comprobar ramas remotas si existen
    git -C "$MAIN_REPO_DIR" fetch origin "$base_branch" 2>/dev/null || true

    # Crear worktree
    if git -C "$MAIN_REPO_DIR" show-ref --verify --quiet "refs/heads/$branch_name"; then
        echo -e "${YELLOW}[GIT]${RESET} Usando rama local existente: ${BOLD}$branch_name${RESET}"
        git -C "$MAIN_REPO_DIR" worktree add "$target_dir" "$branch_name"
    elif git -C "$MAIN_REPO_DIR" show-ref --verify --quiet "refs/remotes/origin/$branch_name"; then
        echo -e "${YELLOW}[GIT]${RESET} Creando rama local desde origin/${BOLD}$branch_name${RESET}"
        git -C "$MAIN_REPO_DIR" worktree add -b "$branch_name" "$target_dir" "origin/$branch_name"
    else
        echo -e "${YELLOW}[GIT]${RESET} Creando nueva rama ${BOLD}$branch_name${RESET} desde ${BOLD}$base_branch${RESET}..."
        git -C "$MAIN_REPO_DIR" worktree add -b "$branch_name" "$target_dir" "$base_branch"
    fi

    # Buscar puerto libre a partir de 6689
    echo -e "${YELLOW}[CONFIG]${RESET} Asignando puerto libre..."
    local free_port
    free_port="$(find_next_free_port 6689)"
    echo -e "  • Puerto Asignado : ${BOLD}$free_port${RESET}"

    # Configurar archivo .env aislado
    local target_env="$target_dir/.env"
    local t_token=""
    local t_chat=""
    local t_thread=""
    if [ -f "$MAIN_REPO_DIR/.env" ]; then
        t_token=$(grep -E '^TELEGRAM_BOT_TOKEN=' "$MAIN_REPO_DIR/.env" 2>/dev/null | cut -d'=' -f2- || true)
        t_chat=$(grep -E '^TELEGRAM_CHAT_ID=' "$MAIN_REPO_DIR/.env" 2>/dev/null | cut -d'=' -f2- || true)
        t_thread=$(grep -E '^TELEGRAM_THREAD_ID=' "$MAIN_REPO_DIR/.env" 2>/dev/null | cut -d'=' -f2- || true)
    fi

    cat <<EOF > "$target_env"
# Variables de Entorno del Worktree Aislado
PORT=$free_port
NODE_ENV=production
CONTAINER_NAME=jorgebarcena_dev_${slug_docker}
COMPOSE_PROJECT_NAME=jorgebarcenadev_${slug_docker}

# Notificaciones a Telegram
TELEGRAM_BOT_TOKEN=${t_token}
TELEGRAM_CHAT_ID=${t_chat}
TELEGRAM_THREAD_ID=${t_thread}
EOF

    echo -e "${GREEN}[OK]${RESET} Entorno aislado configurado correctamente."
    echo -e "\n${BOLD}Resumen del Entorno:${RESET}"
    echo -e "  📁 Directorio : ${BOLD}$target_dir${RESET}"
    echo -e "  🌿 Rama       : ${BOLD}$branch_name${RESET}"
    echo -e "  🌐 Puerto     : ${BOLD}$free_port${RESET}"
    echo -e "  🔗 URL        : ${BOLD}http://localhost:${free_port}/${RESET}"

    if [ "$auto_start" = true ]; then
        echo -e "\n${YELLOW}[DOCKER]${RESET} Levantando contenedores..."
        (cd "$target_dir" && docker compose up -d --build)
        echo -e "${GREEN}[OK]${RESET} Servidor activo en http://localhost:${free_port}/"
    else
        echo -e "\nPara arrancar el contenedor cuando desees:"
        echo -e "  (cd \"$target_dir\" && ./rebuild_docker.sh)"
    fi

    echo -e "\nPara eliminar este entorno al terminar:"
    echo -e "  $0 remove $branch_name"
}

# ------------------------------------------------------------------------------
# COMANDO: LIST
# ------------------------------------------------------------------------------
cmd_list() {
    echo -e "\n${CYAN}${BOLD}=== Entornos de Desarrollo Aislados (Worktrees) ===${RESET}\n"

    git -C "$MAIN_REPO_DIR" worktree list | while read -r line; do
        local path branch
        path="$(echo "$line" | awk '{print $1}')"
        branch="$(echo "$line" | awk '{print $3}' | tr -d '[]')"

        if [ "$path" == "$MAIN_REPO_DIR" ]; then
            echo -e "${BOLD}Principal${RESET} : $path ($branch)"
            local main_port
            main_port=$(grep -E '^PORT=' "$MAIN_REPO_DIR/.env" 2>/dev/null | cut -d'=' -f2 || echo "6688")
            echo -e "  URL    : http://localhost:${main_port}/"
        else
            local port="Desconocido"
            local container_name=""
            if [ -f "$path/.env" ]; then
                port=$(grep -E '^PORT=' "$path/.env" 2>/dev/null | cut -d'=' -f2 || echo "N/A")
                container_name=$(grep -E '^CONTAINER_NAME=' "$path/.env" 2>/dev/null | cut -d'=' -f2 || echo "")
            fi
            echo -e "${GREEN}Worktree${RESET}  : $path"
            echo -e "  Rama   : ${BOLD}$branch${RESET}"
            echo -e "  Puerto : $port"
            echo -e "  URL    : http://localhost:${port}/"
            if [ -n "$container_name" ]; then
                local status
                status=$(docker ps --filter "name=$container_name" --format "{{.Status}}" 2>/dev/null || true)
                if [ -n "$status" ]; then
                    echo -e "  Docker : ${GREEN}Activo${RESET} ($status)"
                else
                    echo -e "  Docker : ${YELLOW}Detenido${RESET}"
                fi
            fi
        fi
        echo ""
    done
}

# ------------------------------------------------------------------------------
# COMANDO: START
# ------------------------------------------------------------------------------
cmd_start() {
    local branch_name="$1"
    if [ -z "$branch_name" ]; then
        echo -e "${RED}[ERROR]${RESET} Especifica el nombre de la rama."
        exit 1
    fi

    local slug_folder
    slug_folder="$(sanitize_slug "$branch_name")"
    local target_dir
    target_dir="$(cd "$MAIN_REPO_DIR/.." && pwd)/${REPO_NAME}_${slug_folder}"

    if [ ! -d "$target_dir" ]; then
        echo -e "${RED}[ERROR]${RESET} No se encontró el worktree en: $target_dir"
        exit 1
    fi

    echo -e "${YELLOW}[DOCKER]${RESET} Iniciando entorno en $target_dir..."
    (cd "$target_dir" && docker compose up -d)
    local port
    port=$(grep -E '^PORT=' "$target_dir/.env" 2>/dev/null | cut -d'=' -f2 || echo "N/A")
    echo -e "${GREEN}[OK]${RESET} Disponible en http://localhost:${port}/"
}

# ------------------------------------------------------------------------------
# COMANDO: STOP
# ------------------------------------------------------------------------------
cmd_stop() {
    local branch_name="$1"
    if [ -z "$branch_name" ]; then
        echo -e "${RED}[ERROR]${RESET} Especifica el nombre de la rama."
        exit 1
    fi

    local slug_folder
    slug_folder="$(sanitize_slug "$branch_name")"
    local target_dir
    target_dir="$(cd "$MAIN_REPO_DIR/.." && pwd)/${REPO_NAME}_${slug_folder}"

    if [ ! -d "$target_dir" ]; then
        echo -e "${RED}[ERROR]${RESET} No se encontró el worktree en: $target_dir"
        exit 1
    fi

    echo -e "${YELLOW}[DOCKER]${RESET} Deteniendo contenedores en $target_dir..."
    (cd "$target_dir" && docker compose down)
    echo -e "${GREEN}[OK]${RESET} Contenedores detenidos."
}

# ------------------------------------------------------------------------------
# COMANDO: REMOVE
# ------------------------------------------------------------------------------
cmd_remove() {
    local branch_name="$1"
    local keep_branch=false

    if [ -z "$branch_name" ]; then
        echo -e "${RED}[ERROR]${RESET} Especifica el nombre de la rama a eliminar."
        exit 1
    fi

    if [ "$2" == "--keep-branch" ] || [ "$2" == "-k" ]; then
        keep_branch=true
    fi

    local slug_folder
    slug_folder="$(sanitize_slug "$branch_name")"
    local target_dir
    target_dir="$(cd "$MAIN_REPO_DIR/.." && pwd)/${REPO_NAME}_${slug_folder}"

    echo -e "\n${YELLOW}Eliminando entorno aislado: ${BOLD}$branch_name${RESET}..."

    if [ -d "$target_dir" ]; then
        if [ -f "$target_dir/docker-compose.yml" ]; then
            echo -e "${YELLOW}[DOCKER]${RESET} Deteniendo y limpiando contenedores..."
            (cd "$target_dir" && docker compose down -v --remove-orphans 2>/dev/null || true)
        fi
        echo -e "${YELLOW}[GIT]${RESET} Eliminando worktree..."
        git -C "$MAIN_REPO_DIR" worktree remove --force "$target_dir" 2>/dev/null || rm -rf "$target_dir"
    fi

    # Prune worktree list
    git -C "$MAIN_REPO_DIR" worktree prune

    if [ "$keep_branch" = false ]; then
        if git -C "$MAIN_REPO_DIR" show-ref --verify --quiet "refs/heads/$branch_name"; then
            echo -e "${YELLOW}[GIT]${RESET} Eliminando rama local ${BOLD}$branch_name${RESET}..."
            git -C "$MAIN_REPO_DIR" branch -D "$branch_name" 2>/dev/null || true
        fi
    fi

    echo -e "${GREEN}[OK]${RESET} Entorno de la rama $branch_name eliminado satisfactoriamente.\n"
}

# ------------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ------------------------------------------------------------------------------
case "$1" in
    create)
        cmd_create "$2" "$3"
        ;;
    list|ls)
        cmd_list
        ;;
    start)
        cmd_start "$2"
        ;;
    stop)
        cmd_stop "$2"
        ;;
    remove|rm)
        cmd_remove "$2" "$3"
        ;;
    *)
        echo -e "${BOLD}Uso de worktree_env.sh:${RESET}"
        echo -e "  $0 create <nombre-rama> [--start]  Crea entorno de feature aislado con puerto libre"
        echo -e "  $0 list                           Lista todos los worktrees y puertos activos"
        echo -e "  $0 start <nombre-rama>             Inicia los contenedores del entorno"
        echo -e "  $0 stop <nombre-rama>              Detiene los contenedores del entorno"
        echo -e "  $0 remove <nombre-rama>            Destruye el entorno y su contenedor"
        exit 1
        ;;
esac
