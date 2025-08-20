import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import './DraggableTaskList.css';

const DraggableTaskList = ({
  tasks,
  taskHistory,
  onReorder,
  onToggle,
  onEdit,
  onDelete,
  onStartEdit,
  onFinishEdit,
  editingId,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate,
  filterCategory
}) => {
  // 使用 useMemo 確保過濾後的任務列表穩定
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      filterCategory === "全部" ? true : task.category === filterCategory
    );
  }, [tasks, filterCategory]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // 創建新的過濾任務列表
    const newFilteredTasks = Array.from(filteredTasks);
    const [movedTask] = newFilteredTasks.splice(sourceIndex, 1);
    newFilteredTasks.splice(destinationIndex, 0, movedTask);

    // 如果是顯示全部任務，直接更新
    if (filterCategory === "全部") {
      const reorderedTasks = newFilteredTasks.map((task, index) => ({
        ...task,
        order: index
      }));
      onReorder(reorderedTasks);
    } else {
      // 如果是過濾狀態，只更新該分類的任務順序
      const updatedTasks = tasks.map(task => {
        if (task.category === filterCategory) {
          const newIndex = newFilteredTasks.findIndex(t => t.id === task.id);
          if (newIndex !== -1) {
            return { ...task, order: newIndex };
          }
        }
        return task;
      });
      onReorder(updatedTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="habit-tasks">
        {(provided, snapshot) => (
          <ul
            className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {filteredTasks.map((task, index) => {
              const uniqueId = `draggable-${task.id}`;
              return (
                <Draggable 
                  key={uniqueId}
                  draggableId={uniqueId}
                  index={index}
                  isDragDisabled={editingId === task.id}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`draggable-task ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <TaskItem
                        task={task}
                        taskHistory={taskHistory}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStartEdit={onStartEdit}
                        onFinishEdit={onFinishEdit}
                        editingId={editingId}
                        editText={editText}
                        setEditText={setEditText}
                        editDueDate={editDueDate}
                        setEditDueDate={setEditDueDate}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <p>沒有找到相關任務</p>
                <p>試著新增一些習慣任務吧！</p>
              </div>
            )}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableTaskList;
