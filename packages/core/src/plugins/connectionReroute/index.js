import React from 'react';
import * as d3 from 'd3-shape';
import Pins from './Pins.vue';
import { findRightIndex, alignEndsHorizontally } from './utils';

function install(editor, { curve = d3.curveCatmullRom.alpha(1), curvature = 0.05 }) {
    editor.on('connectionpath', data => {
        const { connection } = data;
        const [x1, y1, x2, y2] = data.points;
        const pins = connection && connection.data.pins ? connection.data.pins : [];
        const points = [[x1, y1], ...pins.map(({ x, y }) => [x, y]), [x2, y2]];
        const transformedPoints = alignEndsHorizontally(points, curvature);

        data.d = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(curve)
            (transformedPoints)
    });
    editor.on('renderconnection', ({ el, connection }) => {
        const path = el.querySelector('.connection path');
        const pins = connection.data.pins || (connection.data.pins = []);

        if (!path) throw new Error('<path> not found');

        path.addEventListener('click', () => {
            const { mouse } = editor.view.area;
            const pin = { ...mouse };
            const [x1, y1, x2, y2] = editor.view.connections.get(connection).getPoints();
            const points = [{ x: x1, y: y1 }, ...pins, { x: x2, y: y2 }];
            const index = findRightIndex(pin, points);

            pins.splice(index, 0, pin)

            app.$children[0].$forceUpdate();
            editor.view.connections.get(connection).update();
        });

        // convert app to a React component
        const app = (props) => {
            const { editor, connection } = props;
            const pins = connection.data.pins ? connection.data.pins : [];

            return (
                <div>
                    <Pins pins={pins} />
                </div>
            )
        }

        const container = document.createElement('div');
        el.appendChild(container);
        ReactDOM.render(<Component editor={editor} connection={connection} />, container)

    })
}

export default {
    name: 'connection-reroute',
    install
}