# Run huginn without env.huginn file
# docker run -it -p 3000:3000 huginn/huginn

# Create huginn volume if it doesn't exist
docker volume create huginn-data
# Run huginn with env.huginn file
docker run -d -p 3000:3000 --restart=always --env-file .env.huginn -v huginn-data:/var/lib/postgress huginn/huginn

# Remove huginn script
# docker container ls
# docker rm -f <container-name>