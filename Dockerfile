FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

ENV ACCEPT_EULA yes

RUN mkdir -p /home/agent/

RUN groupadd -r agent &&\
    useradd -r -g agent -d /home/agent -s /sbin/nologin -c "Docker image user" agent


ENV HOME=/home/agent
ENV APP_HOME=/home/agent/app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY package*.json ./

RUN apt-get update \
  && apt-get install -y curl vim \
  && curl -sL https://deb.nodesource.com/setup_15.x |  bash - \
  && apt-get install -y supervisor python3 nodejs imagemagick git openssl make build-essential gcc ca-certificates wget software-properties-common lsb-release\
  && npm install -g npm@latest \
  && npm install -g express-generator http pg cors bower mocha sinon should assert node-gyp \
  && npm update \
  && apt-get update --fix-missing \
  && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
  && apt-get autoremove -y \
  && ln -s /usr/bin/nodejs /usr/local/bin/node



COPY . .

RUN chown -R agent:agent $HOME
USER agent
EXPOSE 30005

CMD [ "node", "index.js" ]
