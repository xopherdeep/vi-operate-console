"use client";

import React, { useState } from "react";
import {
  Animate,
  Motion,
  StaggeredAnimation
} from "@/components";

export default function AnimationShowcase() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const cards = [
    { title: "Card 1", content: "This is the first card" },
    { title: "Card 2", content: "This is the second card" },
    { title: "Card 3", content: "This is the third card" },
    { title: "Card 4", content: "This is the fourth card" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Animate type="title" className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Animation Showcase</h1>
        <p className="text-lg text-gray-700">
          Explore the variety of animations available in our component library
        </p>
      </Animate>

      <div className="mb-12">
        <Animate type="fade-in-up" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Single Element Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Motion variant="hover-lift" className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Hover Lift Effect</h3>
              <p className="text-sm text-gray-600">Hover over this card to see it lift up</p>
            </Motion>

            <Motion variant="hover-scale" className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Hover Scale Effect</h3>
              <p className="text-sm text-gray-600">Hover over this card to see it scale up</p>
            </Motion>

            <Motion variant="hover-glow" className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">Hover Glow Effect</h3>
              <p className="text-sm text-gray-600">Hover over this card to see it glow</p>
            </Motion>

            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="float">
                <h3 className="font-medium mb-2">Float Animation</h3>
                <p className="text-sm text-gray-600">This card is floating up and down</p>
              </Animate>
            </div>
          </div>
        </Animate>
      </div>

      <div className="mb-12">
        <Animate type="fade-in-up" className="mb-8" delay={200}>
          <h2 className="text-2xl font-semibold mb-4">Staggered Animations</h2>
          
          <button 
            onClick={toggleVisibility} 
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isVisible ? "Hide Cards" : "Show Cards"}
          </button>
          
          {isVisible && (
            <StaggeredAnimation 
              type="fade-in-left" 
              staggerDelay={300}  // Increased stagger delay for more pronounced effect
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              childClassName="h-full"
            >
              {cards.map((card, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow h-full">
                  <h3 className="font-medium mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.content}</p>
                </div>
              ))}
            </StaggeredAnimation>
          )}
        </Animate>
      </div>

      <div className="mb-12">
        <Animate type="fade-in-up" className="mb-8" delay={400}>
          <h2 className="text-2xl font-semibold mb-4">Animation Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="pulse" infinite>
                <div className="w-full h-12 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-800">Pulse Animation</span>
                </div>
              </Animate>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="rotate" infinite>
                <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </Animate>
              <p className="text-center mt-2 text-sm text-gray-600">Rotate Animation</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="shimmer" className="w-full h-12 rounded"></Animate>
              <p className="text-center mt-2 text-sm text-gray-600">Shimmer Animation</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="bounce" infinite>
                <div className="w-12 h-12 mx-auto bg-green-500 rounded-full"></div>
              </Animate>
              <p className="text-center mt-2 text-sm text-gray-600">Bounce Animation</p>
            </div>
          </div>
        </Animate>
      </div>

      <div className="mb-12">
        <Animate type="fade-in-up" className="mb-8" delay={600}>
          <h2 className="text-2xl font-semibold mb-4">Entrance Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="fade-in" playOnVisible>
                <h3 className="font-medium mb-2">Fade In</h3>
                <p className="text-sm text-gray-600">This card fades in when scrolled into view</p>
              </Animate>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="slide-in-bottom" playOnVisible>
                <h3 className="font-medium mb-2">Slide In Bottom</h3>
                <p className="text-sm text-gray-600">This card slides in from the bottom</p>
              </Animate>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <Animate type="scale-in" playOnVisible>
                <h3 className="font-medium mb-2">Scale In</h3>
                <p className="text-sm text-gray-600">This card scales in when scrolled into view</p>
              </Animate>
            </div>
          </div>
        </Animate>
      </div>
    </div>
  );
}