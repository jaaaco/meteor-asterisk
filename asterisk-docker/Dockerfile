FROM debian:jesse
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install wget libjansson-dev aptitude git build-essential libspeex-dev libspeexdsp-dev libgsm1-dev openssl uuid libjansson4 ncurses-dev libxml2-dev uuid-dev libsqlite3-dev doxygen subversion -y
RUN cd /root;
RUN wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-13-current.tar.gz
RUN tar zxfv asterisk-13-current.tar.gz
RUN cd asterisk-13.6.0/
RUN ./configure
RUN make
RUN make install
EXPOSE 8088 5038 5060 5061 5060/udp 10000-20000/udp
COPY config/ /etc/asterisk/
# TODO: Change settings
CMD ["/usr/sbin/asterisk", "-f"]