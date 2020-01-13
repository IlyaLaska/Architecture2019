FROM node
WORKDIR /server
COPY package*.json ./ 
RUN npm install
COPY . .
WORKDIR web
EXPOSE 4242
CMD ["node","server.js"]
#expose port 4242 for server
#exppose port 4240 to redirect to authServer
#expose port 5555 for db access