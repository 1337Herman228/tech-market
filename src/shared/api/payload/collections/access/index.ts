import type { Access, FieldAccess } from 'payload'

// ─── ROLE CHECKS ─────────────────────────────────────────────────────────────

export const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'ADMIN'
}

export const isUser: Access = ({ req }) => {
  return Boolean(req.user)
}

// User is admin OR the owner of the document
export const isAdminOrOwner: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'ADMIN') return true

  // Returns a Payload query constraint — filters to docs where owner === current user
  return {
    owner: {
      equals: req.user.id,
    },
  }
}

// Field-level: only admins can write this field
export const adminOnlyField: FieldAccess = ({ req }) => {
  return req.user?.role === 'ADMIN'
}