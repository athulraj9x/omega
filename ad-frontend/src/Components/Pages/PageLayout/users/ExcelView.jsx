import React, { useState } from 'react'

const Square = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="square" onClick={toggleFullScreen} />
  </Flipped>
)

const FullScreenSquare = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="full-screen-square" onClick={toggleFullScreen} />
  </Flipped>
)

const AnimatedSquare = () => {
  const [fullScreen, setFullScreen] = useState(false)
  const toggleFullScreen = () => setFullScreen(prevState => !prevState)

  return (
    <Flipper flipKey={fullScreen}>
      {fullScreen ? (
        <FullScreenSquare toggleFullScreen={toggleFullScreen} />
      ) : (
        <Square toggleFullScreen={toggleFullScreen} />
      )}
    </Flipper>
  )
}

export default AnimatedSquare