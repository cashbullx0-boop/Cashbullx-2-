import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ListChecks, Clock, DollarSign, ExternalLink, Loader2, CheckCircle2, Play } from "lucide-react";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  daily: { bg: "bg-cbx-cyan/10", text: "text-cbx-cyan", border: "border-cbx-cyan/20" },
  weekly: { bg: "bg-cbx-purple/10", text: "text-cbx-purple", border: "border-cbx-purple/20" },
  video: { bg: "bg-cbx-gold/10", text: "text-cbx-gold", border: "border-cbx-gold/20" },
  bonus: { bg: "bg-cbx-success/10", text: "text-cbx-success", border: "border-cbx-success/20" },
};

export function TasksPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: tasks } = useQuery({
    queryKey: ["tasks", activeCategory],
    queryFn: async () => {
      let query = supabase.from("tasks").select("*").eq("is_active", true).order("reward_cents", { ascending: false });
      if (activeCategory !== "all") {
        query = query.eq("category", activeCategory as any);
      }
      const { data } = await query;
      return data ?? [];
    },
  });

  const { data: completions } = useQuery({
    queryKey: ["task-completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("task_completions")
        .select("*")
        .eq("user_id", user.id);
      return data ?? [];
    },
    enabled: !!user,
  });

  const startTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("task_completions").insert({
        user_id: user.id,
        task_id: taskId,
        reward_cents: 0,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Task started!");
      queryClient.invalidateQueries({ queryKey: ["task-completions"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const isTaskStarted = (taskId: string) => {
    return completions?.some((c) => c.task_id === taskId);
  };

  const getTaskStatus = (taskId: string) => {
    return completions?.find((c) => c.task_id === taskId)?.status;
  };

  const categories = [
    { value: "all", label: "All" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "video", label: "Video" },
    { value: "bonus", label: "Bonus" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-sm text-cbx-text-secondary mt-1">Complete tasks and earn rewards</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="glass-card p-1 mb-6">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="data-[state=active]:bg-cbx-purple data-[state=active]:text-white rounded-lg px-4"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => {
                  const catStyle = categoryColors[task.category] || categoryColors.daily;
                  const started = isTaskStarted(task.id);
                  const status = getTaskStatus(task.id);

                  return (
                    <Card key={task.id} className="glass-card-hover">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className={`${catStyle.border} ${catStyle.text} text-[10px]`}>
                            {task.category}
                          </Badge>
                          <span className="text-lg font-bold text-cbx-success">
                            ${(task.reward_cents / 100).toFixed(2)}
                          </span>
                        </div>

                        <h3 className="font-semibold mb-1">{task.title}</h3>
                        <p className="text-sm text-cbx-text-secondary mb-4">{task.description}</p>

                        <div className="flex items-center gap-4 text-xs text-cbx-text-secondary mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimated_minutes} min
                          </span>
                        </div>

                        {task.url ? (
                          <a href={task.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="w-full bg-cbx-purple hover:bg-cbx-purple/90">
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Open Task
                            </Button>
                          </a>
                        ) : started ? (
                          <Button
                            size="sm"
                            disabled
                            variant="outline"
                            className="w-full border-cbx-success/30 text-cbx-success"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {status === "pending" ? "Pending Review" : status}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => startTask.mutate(task.id)}
                            disabled={startTask.isPending}
                            className="w-full bg-cbx-cyan hover:bg-cbx-cyan/90 text-cbx-dark font-medium"
                          >
                            {startTask.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Start Task"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <ListChecks className="h-12 w-12 text-cbx-text-secondary mx-auto mb-3" />
                  <p className="text-cbx-text-secondary">No tasks available in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
