const ChannelPreview = ({ channel, content }) => {
    // Email Preview
    if (channel === 'Email') {
      return (
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
          <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="body2" color="text.secondary">From: Your Brand</Typography>
            <Typography variant="body2" color="text.secondary">Subject: {content.headline}</Typography>
          </Box>
          <Typography variant="h6" gutterBottom>{content.headline}</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{content.message}</Typography>
          <Button variant="contained" color="primary">{content.cta}</Button>
        </Box>
      );
    }
  
    // SMS Preview
    if (channel === 'SMS') {
      return (
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderRadius: '1rem',
          maxWidth: '280px',
          position: 'relative'
        }}>
          <Typography variant="body1" sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            p: 2,
            borderRadius: '1rem',
            borderTopLeftRadius: '0.2rem'
          }}>
            {content.message}
            {' '}
            <Link href="#" sx={{ color: 'white', textDecoration: 'underline' }}>
              {content.cta}
            </Link>
          </Typography>
        </Box>
      );
    }
  
    // Social Media Preview (e.g., Instagram-style)
    if (channel === 'Social Media') {
      return (
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 1, 
          border: '1px solid', 
          borderColor: 'grey.200',
          maxWidth: '400px'
        }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>YB</Avatar>
            <Typography variant="subtitle2">Your Brand</Typography>
          </Box>
          <Box sx={{ 
            bgcolor: 'grey.100', 
            width: '100%',
            pt: '100%', 
            position: 'relative',
            backgroundImage: 'url("/api/placeholder/400/400")',
            backgroundSize: 'cover'
          }} />
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" gutterBottom><strong>Your Brand</strong> {content.message}</Typography>
            <Button variant="text" color="primary" startIcon={<FavoriteIcon />}>Like</Button>
            <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>{content.cta}</Typography>
          </Box>
        </Box>
      );
    }
  
    // Push Notification Preview
    if (channel === 'Push Notification') {
      return (
        <Box sx={{ 
          bgcolor: 'grey.900',
          color: 'white',
          p: 2,
          borderRadius: 1,
          maxWidth: '320px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>YB</Avatar>
            <Typography variant="subtitle2">Your Brand • now</Typography>
          </Box>
          <Typography variant="body1" gutterBottom>{content.headline}</Typography>
          <Typography variant="body2" color="grey.400">{content.message}</Typography>
        </Box>
      );
    }
  
    // In-App Message Preview
    if (channel === 'In-App Message') {
      return (
        <Box sx={{ 
          bgcolor: 'white',
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.main',
          maxWidth: '400px',
          position: 'relative'
        }}>
          <IconButton 
            size="small" 
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" gutterBottom>{content.headline}</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>{content.message}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary">{content.cta}</Button>
            <Button variant="text">Not now</Button>
          </Box>
        </Box>
      );
    }
  
    return null;
  };