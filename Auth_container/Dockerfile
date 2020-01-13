FROM node
WORKDIR /auth
COPY package*.json ./ 
RUN npm install
COPY . .
WORKDIR Auth
EXPOSE 4240
#RUN ls -lah
#CMD ["ls", "-lah"]
CMD ["node","authServer.js"]
#expose port 4240 for authServer
#expose port 4241 to redirect to bookingServer?
#expose port 5555 for db access