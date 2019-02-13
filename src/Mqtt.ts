import {IClientOptions, Client, connect, IConnackPacket}  from 'mqtt';
import { TypedEventEmitter } from 'eventemitter-ts';

// Setup Json validation
//////////////////////////////////////////////////////////////////////////////////////////
import * as Ajv from 'ajv';
const ajv = new Ajv();

// load generated typescript type information from json schema
import { EnergyMqttTopic } from './schema/powerMessageSchema';

const energyMqttTopicSchemaValidator = ajv.compile(
        require('../json_schema/powerMessageSchema.json')
    );
//////////////////////////////////////////////////////////////////////////////////////////

export interface MqttMessage {
    topic: String;
    message: EnergyMqttTopic;
  }

export interface Events {
    message: MqttMessage;
}

class Mqtt  extends TypedEventEmitter<Events>  {

    mqttClient: Client;
    // coffeeStateMachine : InfluxDBAdapter;

    constructor(host: string) {
        super();

        // this.coffeeStateMachine = new InfluxDBAdapter();

        const opts: IClientOptions = {}

        this.mqttClient = connect(host, opts);
        this.mqttClient.on('connect', this.onConnect.bind(this));
        this.mqttClient.on('message', this.onMessage.bind(this));
    }

    onConnect() {
        this.mqttClient.subscribe('tele/+/ENERGY');
    }

    // private functions

    onMessage(topic: any, message: any): any {
        try { //JSON.parse may throw an SyntaxError exception
            const messageObj = JSON.parse(message) as EnergyMqttTopic;
            const valid = energyMqttTopicSchemaValidator(messageObj);

            if (true === valid) {
                const msg = {
                    topic: topic,
                    message: messageObj
                };
                // this.coffeeStateMachine.processPowerChange(msg);
                this.emit('message', msg);
            } else {
                console.log(ajv.errorsText(energyMqttTopicSchemaValidator.errors));
            }
        } catch(e) {
            console.error(e);
        }
    }

    end() {
        this.mqttClient.end();
    }
}

export default Mqtt;