"use client";

import React, { useRef, useEffect } from 'react';
import './paddle.css';

const PongPaddle = () => {
	return (
		<div className="container">
			<div className="paddle">
				<div className="solid">
					<div className="surface"></div>
					<div className="hold">
						<div className="top"></div>
						<div className="transition"></div>
						<div className="handle"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PongPaddle;