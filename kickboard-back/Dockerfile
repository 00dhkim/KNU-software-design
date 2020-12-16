FROM ubuntu:20.04

EXPOSE 80
RUN apt update
RUN apt install node
COPY . /
WORKDIR /
CMD ["node", "index.js"]
