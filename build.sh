#!/bin/bash
docker build -t registry.fh.guelland.eu:8082/energy_monitor_to_influxdb .
docker push registry.fh.guelland.eu:8082/energy_monitor_to_influxdb