FROM node:21.0.0
WORKDIR /patrika

COPY ./package-lock.json ./
COPY ./package.json ./

RUN npm install --force

COPY ./ ./

EXPOSE 5001

CMD ["npm", "run", "build"]