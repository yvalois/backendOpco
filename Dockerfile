FROM node:16.16.0

RUN mkdir -p /home/app
WORKDIR /home/app

COPY . .

EXPOSE 3000
RUN ["npm","install"]
RUN ["npm","install","bcrypt"]
CMD ["npm", "start"]