#
# -------- Base ---------

FROM node:8-alpine as builder
LABEL MAINTAINER="Ulrich Van Den Hekke <ulrich.vdh@shadoware.org>"

WORKDIR /src
COPY package.json /src
RUN apk add --no-cache make gcc g++ python git
RUN npm install

ENV NODE_ENV=production

ENV VUE_APP_PIWIK_ENABLED=true
ENV VUE_APP_PIWIK_SITE_URL='${PIWIK_SITE_URL}'
ENV VUE_APP_PIWIK_SITE_ID='${PIWIK_SITE_ID}'

ENV VUE_APP_I18N_LOCALE=fr
ENV VUE_APP_I18N_FALLBACK_LOCALE=en

ENV VUE_APP_GRAPHQL_HTTP_ENDPOINT='https://${GRAPHQL_SERVER}'
ENV VUE_APP_GRAPHQL_WS='wss://${GRAPHQL_SERVER}'

COPY . .
RUN npm run build -- --modern

#
# -------- Dist -----------
FROM nginx:alpine as final
LABEL MAINTAINER="Ulrich Van Den Hekke <ulrich.vdh@shadoware.org>"

COPY src-docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /src/dist /usr/share/nginx/html
COPY --from=builder /src/dist /usr/share/nginx/html.template

CMD ["/bin/sh", "-c", "cd /usr/share/nginx/html.template && for f in $(find ./ -type f); do envsubst '${PIWIK_SITE_URL} ${PIWIK_SITE_ID} ${GRAPHQL_SERVER}' < $f > \"/usr/share/nginx/html/$f\"; done && nginx -g 'daemon off;'"]
