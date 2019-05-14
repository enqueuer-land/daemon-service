[![npm version](https://badge.fury.io/js/daemon-service.svg)](https://badge.fury.io/js/daemon-service)
[![Build Status](https://travis-ci.org/enqueuer-land/daemon-service.svg?branch=master)](https://travis-ci.org/enqueuer-land/daemon-service) 
[![Greenkeeper badge](https://badges.greenkeeper.io/enqueuer-land/daemon-service.svg)](https://greenkeeper.io/)

# daemon-service
Executes enqueuer as a daemon (REST) service

It exposes an HTTP endpoint (POST /requisitions) that consumes a requisition (json or yaml) and return its result. 
