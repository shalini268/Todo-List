import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Checkbox, IconButton, Collapse, Typography, Box, Menu, MenuItem } from '@mui/material';
import { ExpandLess, ExpandMore, Delete, MoreVert } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import './TodoList.css'; // Import the CSS file

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const [selectedTaskId, setSelectedTaskId] = useState(null); // To keep track of the task selected for dropdown

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setSearch(query.get('search') || '');
  }, [location]);

  useEffect(() => {
    // Dummy JSON data
    const dummyTasks = [
      { id: 1, text: 'Task 1', description: 'Description 1', completed: false, lastUpdated: new Date() },
      { id: 2, text: 'Task 2', description: 'Description 2', completed: false, lastUpdated: new Date() }
    ];
    setTasks(dummyTasks);
  }, []);

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = { id: Date.now(), text: task, description: '', completed: false, lastUpdated: new Date() };
      setTasks(prevTasks => [...prevTasks, newTask]);
      setTask('');
    }
  };

  const updateTask = (id, text) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, text, lastUpdated: new Date() } : t));
  };

  const toggleTaskCompletion = (id) => {
    // No change here, as toggling is not done on click for completion now
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    handleMenuClose(); // Close menu after deleting a task
  };

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsComplete = () => {
    if (selectedTaskId) {
      setTasks(prevTasks => prevTasks.map(t => t.id === selectedTaskId ? { ...t, completed: true, lastUpdated: new Date() } : t));
      handleMenuClose(); // Close the menu after marking as complete
    }
  };

  const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(search.toLowerCase()));

  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    navigate(`?search=${newSearch}`);
  };

  return (
    <Container maxWidth="sm">
      <Box className="todo-container" p={3} boxShadow={3}>
        <Typography variant="h4" component="h1" className="todo-header" gutterBottom>
          To-Do List
        </Typography>
        <TextField
          label="Search Tasks"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="New Task"
          variant="outlined"
          fullWidth
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="new-task-input"
        />
        <Button variant="contained" color="primary" onClick={addTask} style={{ marginTop: 10 }}>
          Add Task
        </Button>
        <List className="task-list">
          {filteredTasks.map((task) => (
            <React.Fragment key={task.id}>
              <ListItem
                dense
                button
                onClick={() => toggleTaskCompletion(task.id)} // Optional: For additional functionality, if needed
                className={task.completed ? 'completed' : ''}
              >
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)} // Optional: For additional functionality, if needed
                />
                <ListItemText
                  primary={
                    <TextField
                      value={task.text}
                      onChange={(e) => updateTask(task.id, e.target.value)}
                      fullWidth
                      className="task-input"
                      disabled={task.completed} // Disable input if the task is completed
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    />
                  }
                />
                <IconButton edge="end" aria-label="more" onClick={(event) => handleMenuClick(event, task.id)}>
                  <MoreVert />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                  <Delete />
                </IconButton>
                <IconButton edge="end" onClick={() => handleExpandClick(task.id)}>
                  {expanded === task.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={expanded === task.id} timeout="auto" unmountOnExit>
                <Box ml={5}>
                  <Typography variant="body2" color="textSecondary">Description: {task.description}</Typography>
                  <Typography variant="body2" color="textSecondary">Last Updated: {task.lastUpdated.toLocaleString()}</Typography>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMarkAsComplete}>Mark as Complete</MenuItem>
          {/* No need to add Delete Task option to the dropdown menu */}
        </Menu>
      </Box>
    </Container>
  );
};

export default TodoList;
