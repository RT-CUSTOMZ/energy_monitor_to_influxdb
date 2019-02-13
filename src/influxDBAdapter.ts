// import { TypedEventEmitter } from 'eventemitter-ts';
import { InfluxDB, FieldType } from 'influx';
import { MqttMessage } from './Mqtt';

export class InfluxDBAdapter {
    db : InfluxDB;

    constructor(host: string){
        this.db = new InfluxDB({
            host: host,
            database: 'energy_monitor',
            schema: [
              {
                measurement: 'power_usage',
                fields: {
                  power: FieldType.INTEGER,
                  factor: FieldType.INTEGER,
                  voltage: FieldType.INTEGER,
                  current: FieldType.INTEGER
                },
                tags: [
                  'machineId'
                ]
              }
            ]
          });
    }

    processPowerChange(value: MqttMessage) {
        const machineId = value.topic.split('/')[1];
        this.db.writePoints([
            {
                measurement: 'power_usage',
                tags: { 
                    machineId: machineId
                },
                fields: {
                  power: value.message.Power,
                  factor: value.message['Factor'],
                  voltage: value.message.Voltage,
                  current: value.message.Current
                }
            }
          ]).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
          })
    }
}

export default InfluxDBAdapter;
