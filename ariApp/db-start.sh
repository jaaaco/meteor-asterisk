#!/usr/bin/env bash
docker run -p 27017:27017 -d --name mongodb -d mongo --replSet meteor
docker start mongodb
docker logs mongodb
docker ps

# command to run on database once:
# var config = {_id: "meteor", members: [{_id: 0, host: "127.0.0.1:27017"}]};
# rs.initiate(config);

