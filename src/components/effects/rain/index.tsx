import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion';

export default function RainEffect() {
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-20 w-full h-full'>
      <div className="rain-container back-row-toggle splat-toggle">
        <div className="rain front-row">
          {Array.from({ length: 100 }, (_: number, i: number) => <div ><Drop key={i} increment={i} /></div>)}
        </div>
        <div className="rain back-row">
          {Array.from({ length: 100 }, (_: number, i: number) => <div ><BackDrop key={i} increment={i} /></div>)}
        </div>
      </div>
    </div>
  );
}

const Drop = ({ increment }: {
  increment: number;
}) => {
  const bottomRandom = Math.floor(Math.random() * -4);
  const animationRandom = Math.floor(Math.random() * 99);
  return (
    <div
      className="drop"
      style={{
        left: `${increment}%`,
        bottom: `${bottomRandom + bottomRandom - 1 + 100}%`,
        animationDelay: `0.${animationRandom}s`,
        animationDuration: `0.5${animationRandom}s`
      }}
    >
      <div className="stem"
        style={{
          animationDelay: `0.${animationRandom}s`,
          animationDuration: `0.5${animationRandom}s`
        }}
      ></div>
      <div className="splat"
        style={{
          animationDelay: `0.${animationRandom}s`,
          animationDuration: `0.5${animationRandom}s`
        }}
      ></div>
    </div>
  );
}

const BackDrop = ({ increment }: {
  increment: number;
}) => {
  const bottomRandom = Math.floor(Math.random() * -10);
  const animationRandom = Math.floor(Math.random() * 100);
  return (
    <div
      className="drop"
      style={{
        right: `${increment}%`,
        bottom: `${bottomRandom + bottomRandom - 1 + 100}%`,
        animationDelay: `0.${animationRandom}s`,
        animationDuration: `0.5${animationRandom}s`
      }}
    >
      <div className="stem"
        style={{
          animationDelay: `0.${animationRandom}s`,
          animationDuration: `0.5${animationRandom}s`
        }}
      ></div>
      <div className="splat"
        style={{
          animationDelay: `0.${animationRandom}s`,
          animationDuration: `0.5${animationRandom}s`
        }}
      ></div>
    </div>
  );
}
