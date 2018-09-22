## learn docker

docker version (检查docker版本)

docker search xxxx(查找xxxx的镜像)

docker ps -l(查看容器列表)
docker inspect id(查看id是xx的容器的详细信息)
docker pull learn/tutorial

docker run learn/tutorial echo "hello word"

docker run learn/tutorial ping www.baidu.com
docker run learn/tutorial apt-get install -y ping
