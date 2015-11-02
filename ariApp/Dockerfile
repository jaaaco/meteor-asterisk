FROM meteorhacks/meteord:onbuild

RUN apt-get update
RUN apt-get install curl python tzdata -y
RUN apt-get install --reinstall tzdata
RUN echo "Europe/Warsaw" > /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

