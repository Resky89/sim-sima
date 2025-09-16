import Button from "../ui/Button";

const ActionColumn = ({
  item,
  onView,
  onEdit,
  onDelete,
  customActions = [],
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  const handleAction = (e, action) => {
    e.stopPropagation();
    action(item);
  };

  return (
    <div className="flex items-center space-x-1">
      {showView && (
        <Button
          size="xs"
          variant="ghost"
          onClick={(e) => handleAction(e, onView)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
          title="Lihat Detail"
        >
          👁️
        </Button>
      )}

      {showEdit && (
        <Button
          size="xs"
          variant="ghost"
          onClick={(e) => handleAction(e, onEdit)}
          className="text-green-600 hover:text-green-800 hover:bg-green-50 transition-all duration-200"
          title="Edit"
        >
          ✏️
        </Button>
      )}

      {showDelete && (
        <Button
          size="xs"
          variant="ghost"
          onClick={(e) => handleAction(e, onDelete)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200"
          title="Hapus"
        >
          🗑️
        </Button>
      )}

      {customActions.map((action, index) => (
        <Button
          key={index}
          size="xs"
          variant="ghost"
          onClick={(e) => handleAction(e, action.handler)}
          className={
            action.className ||
            "text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
          }
          title={action.title}
        >
          {action.icon}
        </Button>
      ))}
    </div>
  );
};

export default ActionColumn;
