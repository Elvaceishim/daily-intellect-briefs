import { Box, Typography, Avatar, Stack } from '@mui/material';

export default function ProfileSection({ user }: { user: any }) {
  return (
    <Box>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Avatar src={user.avatar} sx={{ width: 64, height: 64 }}>
          {user.name[0]}
        </Avatar>
        <Box>
          <Typography variant="h5">{user.name}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
        </Box>
      </Stack>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Interests:
      </Typography>
      <Stack direction="row" spacing={1}>
        {user.interests.map((interest: string) => (
          <Box
            key={interest}
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 2,
              background: '#f0abfc',
              color: '#3b0764',
              fontWeight: 500,
            }}
          >
            {interest}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}