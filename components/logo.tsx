import React from 'react'
import { Box, Flex } from '@sanity/ui'

const LogoComponent = () => {
  const handleLogoClick = () => {
    // Replace with your custom link
    window.open('https://your-website.com', '_blank')
  }

  return (
    <Box padding={3}>
      <Flex align="center" justify="center">
        <div
          onClick={handleLogoClick}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            background: 'transparent', // Remove background for image-only
          }}
         
        >
          {/* Logo Image */}
          <img 
            src={"/static/brand.png"} // Use imported image
            alt="CHTVANGUARD Logo"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
        </div>
      </Flex>
    </Box>
  )
}

export default LogoComponent