import * as React from "react";
import {TranslateReact} from "./TranslateReact";

export type FormattedMessageProps = {
	__: string,
	children?: (msg: any) => React.ReactNode,
	key?: any,
	tagName?: string,
	[key: string]: any
}

export class FormattedMessage extends React.Component<FormattedMessageProps> {
	render(): React.ReactNode {
		const {__, children, tagName, ...other} = this.props;
		const msg = TranslateReact('span')(__, other);
		return (typeof children === 'function' && children(msg)) || React.createElement(tagName || 'span', {}, msg)
	}
}

