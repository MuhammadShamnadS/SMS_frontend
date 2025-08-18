import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Class as ClassIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import axios from "../../../api/axios";
import ChatWindow from "../Students/ChatWindow"

// InfoRow.jsx
const InfoRow = ({ label, icon: Icon }) => (
  <Box display="flex" alignItems="center" gap={1}>
    {Icon && <Icon />}
    <Typography>{label}</Typography>
  </Box>
);



const StudentDashboard = () => {
  const theme = useTheme();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/my-details");
        setStudent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!student) return null;

  const fullName = `${student?.user?.first_name || ""} ${student?.user?.last_name || ""}`.trim();
  const teacher = student?.assigned_teacher;

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {fullName || "Student"}
      </Typography>

      {/* Student Info Card */}
      <Card
        sx={{
          mb: 5,
          p: 3,
          borderRadius: 4,
          background: `linear-gradient(135deg, #f3f4f6, #e2e8f0)`,
          boxShadow: 6,
          color: "black",
        }}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: "black", color: "white", fontWeight: 700 }}>
            {student?.user?.first_name?.[0]?.toUpperCase() || "S"}
          </Avatar>
          <Box>
            <Typography variant="h6">{fullName}</Typography>
            <Stack spacing={1} mt={1}>
              <InfoRow icon={EmailIcon} label={student?.user?.email} />
              <InfoRow icon={PhoneIcon} label={student?.phone} />
              <InfoRow icon={BadgeIcon} label={`Roll No: ${student?.roll_number}`} />
              <InfoRow icon={ClassIcon} label={`Class: ${student?.student_class}`} />
              <InfoRow icon={AssignmentIndIcon} label={`Admission Date: ${student?.admission_date}`} />
              <InfoRow icon={PersonIcon} label={`Username: ${student?.user?.username}`} />
            </Stack>
          </Box>
        </Box>
      </Card>

      {/* Teacher Info Card */}
      {teacher ? (
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, #f3f4f6, #e2e8f0)`,
            boxShadow: 4,
          }}
        >
<Box display="flex" alignItems="center" gap={3}>
  <Avatar
    sx={{
      width: 72,
      height: 72,
      bgcolor: "black",
      color: "white",
      fontWeight: 700,
    }}
  >
    {teacher?.user?.first_name?.[0]?.toUpperCase() || "T"}
  </Avatar>

  <Box>
    {/* Card Title */}
    <Typography variant="h6" fontWeight={600}>
      My Assigned Teacher
    </Typography>

    {/* Teacher Info */}
    <Stack spacing={1} mt={1}>
      <InfoRow
        label={`Name: ${teacher?.user?.first_name || ""} ${teacher?.user?.last_name || ""}`}
      />
      <InfoRow icon={EmailIcon} label={teacher?.user?.email} />
      <InfoRow icon={PhoneIcon} label={teacher?.phone} />
      <InfoRow icon={ClassIcon} label={`Subject: ${teacher?.subject_specialization}`} />
      <InfoRow icon={AssignmentIndIcon} label={`Joined: ${teacher?.date_of_joining}`} />
      <InfoRow icon={BadgeIcon} label={`Status: ${teacher?.status}`} />
      <InfoRow icon={PersonIcon} label={`Username: ${teacher?.user?.username}`} />
    </Stack>
  </Box>
</Box>

        </Card>
      ) : (
        <Alert severity="info" sx={{ mt: 3 }}>
          No assigned teacher yet.
        </Alert>
      )}
    </Container>
  );
};

export default StudentDashboard;
