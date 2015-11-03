FROM debian:jessie
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install wget libjansson-dev aptitude git build-essential libspeex-dev libspeexdsp-dev libgsm1-dev openssl uuid libjansson4 ncurses-dev libxml2-dev uuid-dev libsqlite3-dev doxygen subversion -y
RUN cd /root && wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-13-current.tar.gz
RUN cd /root && tar zxfv asterisk-13-current.tar.gz
RUN cd /root/asterisk-13.6.0/ && ./configure
COPY menuselect.makeopts /root/asterisk-13.6.0/menuselect.makeopts
#RUN cd /root/asterisk-13.6.0/ && make
#RUN cd /root/asterisk-13.6.0/ && make install
#COPY config/ /etc/asterisk/
#EXPOSE 8088 5038 5060 5061 5060/udp 10000-20000/udp
#CMD ["/usr/sbin/asterisk", "-fvvv"]