/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import '../karavan.css';
import {InOut} from "../model/ConnectionModels";
import {Subscription} from "rxjs";
import {EventBus} from "../api/EventBus";
import {Text} from "@patternfly/react-core";

interface Props {
    inout: InOut,
}

interface State {
    inout: InOut
    top: number
    sub?: Subscription
    fsub?: Subscription
    fRect?: DOMRect
}

export class DslInOut extends React.Component<Props, State> {

    public state: State = {
        inout: this.props.inout,
        top: this.props.inout.top
    };

    componentDidMount() {
        const sub = EventBus.onPosition()?.subscribe(evt => {
            if (evt.step.uuid === this.state.inout.uuid) {
                this.setState({top: evt.rect.top});
            }
        });
        this.setState({sub: sub});
        const fsub = EventBus.onFlowPosition()?.subscribe(evt => {
            this.setState({fRect: evt});
        });
        this.setState({fsub: fsub});
    }

    componentWillUnmount() {
        this.state.sub?.unsubscribe();
        this.state.fsub?.unsubscribe();
    }

    getTop() {
        if (this.state.fRect) {
            return (this.state.top + this.state.inout.index * 10) - this.state.fRect?.top;
        } else {
            return this.state.top + this.state.inout.index * 10;
        }
    }

    getRight() {
        return this.state.inout.index * 15;
    }

    render() {
        return (
            <div className={this.state.inout.type === 'out' ? 'outgoing' : 'incoming'}
                 style={{top: this.getTop() + 'px', right: this.getRight() + 'px'}}>
                {this.state.inout.icon && <img draggable={false}
                                               src={this.state.inout.icon}
                                               className="icon" alt="icon">
                </img>}
                {this.state.inout.name &&
                <Text className="inout-name">{this.state.inout.name.substr(0, 1).toUpperCase()}</Text>}
            </div>
        );
    }
}
