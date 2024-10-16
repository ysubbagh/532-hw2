/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { Message } from '../models/messages';

// tslint:disable-next-line:cyclomatic-complexity
export const parseEventHubMessage = async (message: Message, decoderPrototype?: Type): Promise<Message> => {

    if (!message) {
        return null;
    }

    if (!message.body) {
        return message;
    }

    // if message body's type is buffer, convert to string
    if (message.body.type === 'Buffer') {
        if (decoderPrototype) {
            return {
                ...message,
                body: decoderPrototype.decode(message.body.data)
            };
        }

        return {
            ...message,
            body: new Buffer(message.body.data).toString('ascii')
        };
    }

    return message;
};
