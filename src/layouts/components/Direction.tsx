// ** React Imports
import { useEffect, ReactNode } from 'react'

// ** MUI Imports
import { Direction } from '@mui/material'

// ** Emotion Imports

// ** RTL Plugin


interface DirectionProps {
  children: ReactNode
  direction: Direction
}


const Direction = (props: DirectionProps) => {
  const { children, direction } = props

  useEffect(() => {
    document.dir = direction
  }, [direction])



  return <>{children}</>
}

export default Direction
