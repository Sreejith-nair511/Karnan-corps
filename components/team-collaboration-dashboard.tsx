"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UsersIcon, 
  MessageSquareIcon, 
  FileTextIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  PlusIcon,
  SendIcon,
  UserIcon,
  TrophyIcon
} from "lucide-react";
import { motion } from "framer-motion";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

type Message = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
};

type Task = {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
  dueDate: string;
};

export function TeamCollaborationDashboard() {
  const [newMessage, setNewMessage] = useState("");
  const [newTask, setNewTask] = useState("");
  
  const teamMembers: TeamMember[] = [
    { id: "1", name: "Goodwell Sreejith S", role: "AI/ML Lead", avatar: "GS" },
    { id: "2", name: "Tejaswini sa ", role: "Data Scientist", avatar: "V" },
    { id: "3", name: "rohith ", role: "Frontend Developer", avatar: "N" },
    { id: "4", name: "You", role: "Team Lead", avatar: "Y" },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", userId: "1", userName: "Goodwell Sreejith S", content: "Finished training the solar detection model with 94.2% accuracy!", timestamp: "2 hours ago" },
    { id: "2", userId: "2", userName: "teajswini ", content: "Dataset preprocessing complete. Ready for model training.", timestamp: "4 hours ago" },
    { id: "3", userId: "3", userName: "rohtih ", content: "UI dashboard is 80% complete. Need feedback on the prediction charts.", timestamp: "1 day ago" },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Train solar panel detection model", assignedTo: "Goodwell Sreejith S", completed: true, dueDate: "2024-11-01" },
    { id: "2", title: "Preprocess satellite imagery", assignedTo: "Vasudha", completed: true, dueDate: "2024-10-30" },
    { id: "3", title: "Design prediction dashboard UI", assignedTo: "Nikhil", completed: false, dueDate: "2024-11-05" },
    { id: "4", title: "Integrate API with frontend", assignedTo: "You", completed: false, dueDate: "2024-11-07" },
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      userId: "4",
      userName: "You",
      content: newMessage,
      timestamp: "Just now"
    };
    
    setMessages([newMsg, ...messages]);
    setNewMessage("");
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    
    const newTaskItem: Task = {
      id: (tasks.length + 1).toString(),
      title: newTask,
      assignedTo: "You",
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    setTasks([newTaskItem, ...tasks]);
    setNewTask("");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <Card className="glass-card border-primary/20 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-primary" />
          EcoInnovators Team Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Team Members
            </h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Competition Info */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrophyIcon className="h-4 w-4 text-primary" />
                Competition Info
              </h4>
              <p className="text-sm text-muted-foreground">
                EcoInnovators Ideathon 2026 - College Edition
              </p>
              <div className="mt-2 text-xs">
                <div className="flex justify-between">
                  <span>Prize:</span>
                  <span className="font-medium">₹1,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">Switzerland</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                Team Chat
              </h3>
              <div className="bg-muted rounded-lg p-4 h-48 overflow-y-auto mb-3">
                {messages.map((message) => (
                  <div key={message.id} className="mb-3 last:mb-0">
                    <div className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[8px] text-primary-foreground font-bold mt-1">
                        {message.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  Tasks
                </h3>
                <Button size="sm" variant="outline" onClick={handleAddTask}>
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      task.completed 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-primary/5 border-primary/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className={`h-6 w-6 rounded-full ${
                        task.completed 
                          ? 'bg-green-500 border-green-500 text-primary-foreground' 
                          : 'border-primary'
                      }`}
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed && <CheckCircleIcon className="h-3 w-3" />}
                    </Button>
                    <div className="flex-1">
                      <div className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        {task.assignedTo}
                        <CalendarIcon className="h-3 w-3 ml-2" />
                        {task.dueDate}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
