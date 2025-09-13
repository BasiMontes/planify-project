import { User } from "@/entities/User";
import { Collaboration } from "@/entities/Collaboration";
import { Budget } from "@/entities/Budget";
import { Goal } from "@/entities/Goal";
import { Expense } from "@/entities/Expense";
import { Income } from "@/entities/Income";

export const getCurrentUser = async () => {
  try {
    return await User.me();
  } catch (error) {
    throw new Error("Usuario no autenticado");
  }
};

export const canAccessEntity = async (entityType, entityId, requiredPermission = "view") => {
  const user = await getCurrentUser();
  
  // Get the correct entity based on type
  let Entity;
  switch (entityType) {
    case "budget":
      Entity = Budget;
      break;
    case "goal":
      Entity = Goal;
      break;
    case "expense":
      Entity = Expense;
      break;
    case "income":
      Entity = Income;
      break;
    default:
      throw new Error(`Tipo de entidad desconocido: ${entityType}`);
  }
  
  // Check if user is owner
  try {
    const entity = await Entity.get(entityId);
    
    if (entity.created_by === user.email) {
      return true;
    }
    
    // Check collaboration permissions
    const collaborations = await Collaboration.filter({
      entity_type: entityType,
      entity_id: entityId,
      collaborator_email: user.email,
      status: "accepted"
    });
    
    if (collaborations.length === 0) {
      return false;
    }
    
    const collaboration = collaborations[0];
    const permissionLevels = { "view": 1, "edit": 2, "admin": 3 };
    
    return permissionLevels[collaboration.permission_level] >= permissionLevels[requiredPermission];
  } catch (error) {
    // If entity doesn't exist or access denied
    return false;
  }
};

export const secureEntityOperation = async (entityType, entityId, operation, requiredPermission = "edit") => {
  const hasAccess = await canAccessEntity(entityType, entityId, requiredPermission);
  if (!hasAccess) {
    throw new Error("No tienes permisos para realizar esta operación");
  }
  return operation();
};

export const getUserEntities = async (entityType) => {
  const user = await getCurrentUser();
  
  // Get the correct entity based on type
  let Entity;
  switch (entityType) {
    case "budget":
      Entity = Budget;
      break;
    case "goal":
      Entity = Goal;
      break;
    case "expense":
      Entity = Expense;
      break;
    case "income":
      Entity = Income;
      break;
    default:
      throw new Error(`Tipo de entidad desconocido: ${entityType}`);
  }
  
  // Get owned entities
  const ownedEntities = await Entity.filter({ created_by: user.email });
  
  // Get shared entities
  const collaborations = await Collaboration.filter({
    entity_type: entityType,
    collaborator_email: user.email,
    status: "accepted"
  });
  
  const sharedEntities = await Promise.all(
    collaborations.map(async (collab) => {
      try {
        const entity = await Entity.get(collab.entity_id);
        return { ...entity, _isShared: true, _permission: collab.permission_level };
      } catch {
        return null;
      }
    })
  );
  
  return [...ownedEntities, ...sharedEntities.filter(Boolean)];
};