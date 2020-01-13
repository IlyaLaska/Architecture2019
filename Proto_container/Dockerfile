FROM node
WORKDIR /proto
COPY package*.json ./ 
RUN npm install
COPY . .
WORKDIR protos
EXPOSE 4250
CMD ["node","route_guide_server.js"]
#expose port 4250 for route_guide_server
#expose port 5555 for db access
