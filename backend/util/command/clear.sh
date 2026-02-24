echo "🛑 Stopping all running containers..."
docker stop $(docker ps -q)

echo "🗑️ Removing stopped containers..."
docker container prune -f

echo "🧼 Removing dangling/unused images (not in use by any container)..."
docker image prune -f

echo "🧹 Removing unused volumes (optional)..."
docker volume prune -f

echo "🚿 Removing unused networks..."
docker network prune -f

echo "✅ Docker cleaned safely. Build cache preserved!"
