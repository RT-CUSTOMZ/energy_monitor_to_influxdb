import Mqtt from "./Mqtt";
import {InfluxDBAdapter} from './influxDBAdapter';

console.log("Energy to InfluxDB forwarder is starting")


const mqttHost = process.env.MQTT_HOST || 'ws://mqtt.42volt.de:9001/';
const influxDBHost = process.env.INFLUXDB_HOST || 'fedora.fh.guelland.eu';

const mqtt = new Mqtt(mqttHost);
const influxDBAdapter = new InfluxDBAdapter(influxDBHost);

mqtt.on('message', influxDBAdapter.processPowerChange.bind(influxDBAdapter));

process.on('SIGTERM', function () {
  console.log("Energy to InfluxDB forwarder is shuting down")
  mqtt.end();

  // shutdown anyway after some time
  setTimeout(function(){
      process.exit(0);
  }, 8000);
});
