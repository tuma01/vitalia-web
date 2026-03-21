const fs = require('fs');
const path = require('path');

const openapiPath = path.join(__dirname, '..', 'src', 'openapi', 'openapi.json');
const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

// 1. Add new paths
openapi.paths['/auth/invitations'] = {
  ...openapi.paths['/auth/invitations'],
  get: {
    tags: ['User Invitations'],
    summary: 'Get paginated invitations [TENANT_ADMIN]',
    description: 'Retrieves an efficiently paginated chunk of target Invitations aligned to Tenant scope restrictions.',
    operationId: 'getInvitations',
    parameters: [
      {
        name: 'tenantCode',
        in: 'query',
        required: true,
        schema: { type: 'string' }
      },
      {
        name: 'pageIndex',
        in: 'query',
        schema: { type: 'integer', format: 'int32', default: 0 }
      },
      {
        name: 'pageSize',
        in: 'query',
        schema: { type: 'integer', format: 'int32', default: 10 }
      }
    ],
    responses: {
      200: {
        description: 'OK alongside the standard PageResponseDto payload.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/PageResponseDtoInvitationResponse' }
          }
        }
      }
    }
  }
};

openapi.paths['/auth/invitations/{id}/resend'] = {
  post: {
    tags: ['User Invitations'],
    summary: 'Resend invitation email [TENANT_ADMIN]',
    description: 'Invalidates the existing token and emits a new one via email bridge.',
    operationId: 'resendInvitation',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', format: 'int64' }
      }
    ],
    responses: {
      200: {
        description: 'Newly emitted token boundary metadata.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/InvitationResponse' }
          }
        }
      }
    }
  }
};

// 2. Add new schema
openapi.components.schemas['PageResponseDtoInvitationResponse'] = {
  type: 'object',
  properties: {
    content: {
      type: 'array',
      items: { $ref: '#/components/schemas/InvitationResponse' }
    },
    totalElements: { type: 'integer', format: 'int64' },
    pageIndex: { type: 'integer', format: 'int32' },
    pageSize: { type: 'integer', format: 'int32' },
    totalPages: { type: 'integer', format: 'int32' },
    first: { type: 'boolean' },
    last: { type: 'boolean' },
    empty: { type: 'boolean' },
    numberOfElements: { type: 'integer', format: 'int32' }
  }
};

fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 2), 'utf8');
console.log('✅ openapi.json updated successfully!');
