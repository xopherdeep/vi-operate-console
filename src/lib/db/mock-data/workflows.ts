// filepath: /home/xopher/www/vi/transform/vi-operate-console/src/lib/mock-data/workflows.ts

export const workflowsMockData = [
  {
    class_name: 'Workflow',
    id: 1,
    name: 'Labor Forecast Workflow',
    description: 'Automated call volume prediction and staffing requirements',
    organization_id: 1,
    creator_id: 1,
    config: {
      triggers: [
        {
          node_type: 'trigger_schedule',
          settings: {
            schedule: '0 0 * * *', // Daily at midnight
            timezone: 'America/New_York',
            is_enabled: true
          },
          parameters: {
            call_volume_threshold: 100,
            staffing_ratio: 0.8,
            forecast_period: '7d'
          }
        },
        {
          node_type: 'trigger_manual',
          settings: {},
          parameters: {}
        }
      ],
      nodes: [],
      edges: []
    },
    is_active: true,
    created_int: 1700000000,
    updated_int: 1700000000
  },
  {
    class_name: 'Workflow',
    id: 2,
    name: '24GO Customer Support Tickets',
    description: 'Automated responses to customer support tickets',
    organization_id: 1,
    creator_id: 1,
    config: {
      trigger_parameters: {
        ticket_id: {
          type: 'string',
          description: 'The ID of the Zendesk ticket',
          is_required: true
        },
        ticket_title: {
          type: 'string',
          description: 'The title of the Zendesk ticket'
        },
        ticket_description: {
          type: 'string',
          description: 'The description of the Zendesk ticket'
        },
        ticket_tags: {
          type: 'array',
          description: 'The tags associated with the Zendesk ticket'
        },
        ticket_status: {
          type: 'string',
          description: 'The status of the Zendesk ticket'
        }
      },
      triggers: [
        {
          id: 'zendesk_webhook',
          node_type: 'trigger_webhook',
          name: 'Zendesk New Ticket Webhook',
          settings: {
            method: 'POST',
            url: 'https://conductor.operate.vi.co/conductor/workflows/2/run',
          },
          position: { x: 100, y: 100 }
        }
      ],
      nodes: [
        {
          id: 'fetch_ticket_data',
          node_type: 'external_request',
          name: 'Fetch Zendesk Ticket Data',
          settings: {
            method: 'GET',
            url: 'https://24go.zendesk.com/api/v2/tickets/{{inputs.ticket_id}}',
            headers: {
              'Authorization': 'Bearer {{secrets.ZENDESK_API_KEY}}',
              'Content-Type': 'application/json'
            }
          },
          position: { x: 250, y: 100 }
        },
        {
          id: 'fetch_requester_data',
          node_type: 'external_request',
          name: 'Fetch Requester Data',
          settings: {
            method: 'GET',
            url: 'https://24go.zendesk.com/api/v2/users/{{fetch_ticket_data.outputs.ticket.requester_id}}',
            headers: {
              'Authorization': 'Bearer {{secrets.ZENDESK_API_KEY}}',
              'Content-Type': 'application/json'
            }
          },
          position: { x: 400, y: 100 }
        },
        {
          id: 'extract_identifiers',
          node_type: 'ai_prompt',
          name: 'Extract Customer Identifiers',
          settings: {
            prompt_name: 'extract_requesters',
            prompt_template: 'Extract all customer identifiers from the following requester data. Return email, phone_number, and member_number with confidence levels for each extraction.\n\n{{fetch_requester_data.outputs}}',
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.1
          },
          position: { x: 550, y: 100 }
        },
        {
          id: 'filter_high_confidence',
          node_type: 'data_transform',
          name: 'Filter High Confidence Data',
          settings: {
            code: `
              const result = {};
              const fieldsToMap = {
                email: "emails",
                phone_number: "phone_numbers",
                member_number: "member_numbers"
              };
              
              const extractedData = inputs.extract_identifiers.finalAnswer || [];
              for (const item of extractedData) {
                for (const [key, mappedKey] of Object.entries(fieldsToMap)) {
                  if (item[key] && item.confidence === "high") {
                    if (!result[mappedKey]) result[mappedKey] = [];
                    result[mappedKey].push(item[key]);
                  }
                }
              }
              return result;
            `
          },
          position: { x: 700, y: 100 }
        },
        {
          id: 'search_24go_users',
          node_type: 'external_request',
          name: 'Search 24GO Users',
          settings: {
            method: 'POST',
            url: 'https://api.24go.co/api/v1/users/search',
            headers: {
              'Authorization': 'Bearer {{secrets.GO24_API_KEY}}',
              'Content-Type': 'application/json'
            },
            body: `{
              "emails": {{filter_high_confidence.outputs.emails}},
              "phone_numbers": {{filter_high_confidence.outputs.phone_numbers}},
              "member_numbers": {{filter_high_confidence.outputs.member_numbers}}
            }`
          },
          position: { x: 850, y: 50 }
        },
        {
          id: 'search_by_name_dob',
          node_type: 'external_request',
          name: 'Search By Name and DOB',
          settings: {
            method: 'POST',
            url: 'https://api.24go.co/api/v1/members/search',
            headers: {
              'Authorization': 'Bearer {{secrets.GO24_API_KEY}}',
              'Content-Type': 'application/json'
            },
            body: `{
              "name": "{{fetch_requester_data.outputs.user.name}}",
              "date_of_birth": "{{fetch_requester_data.outputs.user.date_of_birth}}"
            }`
          },
          position: { x: 850, y: 150 }
        },
        {
          id: 'consolidate_user_data',
          node_type: 'data_transform',
          name: 'Consolidate User Data',
          settings: {
            code: `
              return {
                ticket: inputs.fetch_ticket_data.outputs,
                requester: inputs.fetch_requester_data.outputs,
                user_search: inputs.search_24go_users.outputs,
                member_search: inputs.search_by_name_dob.outputs
              };
            `
          },
          position: { x: 1000, y: 100 }
        },
        {
          id: 'classify_ticket',
          node_type: 'ai_prompt',
          name: 'Classify Support Ticket',
          settings: {
            prompt_name: 'classify_ticket',
            prompt_template: `
              Classify this ticket based on the following information:
              
              Ticket details: {{consolidate_user_data.outputs.ticket}}
              Requester information: {{consolidate_user_data.outputs.requester}}
              24GO user data: {{consolidate_user_data.outputs.user_search}}
              Member data: {{consolidate_user_data.outputs.member_search}}
              
              Classify into one of the following categories:
              - Account Access
              - Billing Issue
              - Technical Support
              - Feature Request
              - Club Membership
              - General Inquiry
              
              Provide a brief explanation for your classification.
              
              Return your answer in the following JSON format:
              {
                "category": "selected category",
                "explanation": "brief explanation for the classification"
              }
            `,
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.1
          },
          position: { x: 1150, y: 100 }
        },
        {
          id: 'update_ticket',
          node_type: 'external_request',
          name: 'Update Zendesk Ticket',
          settings: {
            method: 'PUT',
            url: 'https://24go.zendesk.com/api/v2/tickets/{{inputs.ticket_id}}',
            headers: {
              'Authorization': 'Bearer {{secrets.ZENDESK_API_KEY}}',
              'Content-Type': 'application/json'
            },
            body: `{
              "ticket": {
                "tags": {{fetch_ticket_data.outputs.ticket.tags}}.concat(["{{classify_ticket.outputs.category}}"]),
                "custom_fields": {
                  "classification": "{{classify_ticket.outputs.category}}"
                },
                "comment": {
                  "body": "Auto-classified as: {{classify_ticket.outputs.category}}\\n\\nReason: {{classify_ticket.outputs.explanation}}",
                  "public": false
                }
              }
            }`
          },
          position: { x: 1300, y: 100 }
        },
        {
          id: 'determine_response',
          node_type: 'logic_condition',
          name: 'Determine Response Type',
          settings: {
            conditions: [
              {
                "condition": "{{classify_ticket.outputs.category}} === 'Account Access'",
                "target": "account_access_template"
              },
              {
                "condition": "{{classify_ticket.outputs.category}} === 'Billing Issue'",
                "target": "billing_template"
              },
              {
                "condition": "{{classify_ticket.outputs.category}} === 'Technical Support'",
                "target": "tech_support_template" 
              },
              {
                "condition": "true",
                "target": "general_template"
              }
            ]
          },
          position: { x: 1450, y: 100 }
        },
        {
          id: 'account_access_template',
          node_type: 'ai_prompt',
          name: 'Generate Account Access Response',
          settings: {
            prompt_name: 'account_access_response',
            prompt_template: `
              Generate a helpful response for a customer having account access issues.
              Use the following information to personalize the response:
              
              Customer name: {{consolidate_user_data.outputs.requester.user.name}}
              Issue description: {{fetch_ticket_data.outputs.ticket.description}}
              
              The response should:
              1. Address the customer by name
              2. Acknowledge their specific issue
              3. Provide clear steps to resolve account access problems
              4. Include links to relevant help articles
              5. Offer additional support options
            `,
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.7
          },
          position: { x: 1600, y: 0 }
        },
        {
          id: 'billing_template',
          node_type: 'ai_prompt',
          name: 'Generate Billing Response',
          settings: {
            prompt_name: 'billing_response',
            prompt_template: `
              Generate a helpful response for a customer with billing issues.
              Use the following information to personalize the response:
              
              Customer name: {{consolidate_user_data.outputs.requester.user.name}}
              Issue description: {{fetch_ticket_data.outputs.ticket.description}}
              
              The response should:
              1. Address the customer by name
              2. Acknowledge their billing concern
              3. Explain relevant billing policies
              4. Provide clear next steps
              5. Include contact information for the billing department
            `,
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.7
          },
          position: { x: 1600, y: 100 }
        },
        {
          id: 'tech_support_template',
          node_type: 'ai_prompt',
          name: 'Generate Tech Support Response',
          settings: {
            prompt_name: 'tech_support_response',
            prompt_template: `
              Generate a helpful technical support response.
              Use the following information to personalize the response:
              
              Customer name: {{consolidate_user_data.outputs.requester.user.name}}
              Issue description: {{fetch_ticket_data.outputs.ticket.description}}
              Device information: {{fetch_ticket_data.outputs.ticket.custom_fields.device_info}}
              
              The response should:
              1. Address the customer by name
              2. Acknowledge their technical issue
              3. Provide troubleshooting steps
              4. Include links to relevant help documentation
              5. Offer escalation options if the issue persists
            `,
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.7
          },
          position: { x: 1600, y: 200 }
        },
        {
          id: 'general_template',
          node_type: 'ai_prompt',
          name: 'Generate General Response',
          settings: {
            prompt_name: 'general_response',
            prompt_template: `
              Generate a helpful general response for the customer's inquiry.
              Use the following information to personalize the response:
              
              Customer name: {{consolidate_user_data.outputs.requester.user.name}}
              Issue description: {{fetch_ticket_data.outputs.ticket.description}}
              
              The response should:
              1. Address the customer by name
              2. Acknowledge their inquiry
              3. Provide helpful information
              4. Include relevant resources
              5. Offer additional assistance
            `,
            model: 'anthropic/claude-3-sonnet-20240229',
            temperature: 0.7
          },
          position: { x: 1600, y: 300 }
        },
        {
          id: 'add_response_comment',
          node_type: 'external_request',
          name: 'Add Response to Ticket',
          settings: {
            method: 'PUT',
            url: 'https://24go.zendesk.com/api/v2/tickets/{{inputs.ticket_id}}',
            headers: {
              'Authorization': 'Bearer {{secrets.ZENDESK_API_KEY}}',
              'Content-Type': 'application/json'
            },
            body: `{
              "ticket": {
                "comment": {
                  "body": "{{determine_response.outputs.result}}",
                  "public": true
                },
                "status": "pending"
              }
            }`
          },
          position: { x: 1750, y: 100 }
        },
        {
          id: 'send_notification',
          node_type: 'output_slack',
          name: 'Send Slack Notification',
          settings: {
            channel: "#support-tickets",
            message: "Ticket #{{inputs.ticket_id}} ({{fetch_ticket_data.outputs.ticket.title}}) has been auto-classified as {{classify_ticket.outputs.category}} and an initial response has been sent."
          },
          position: { x: 1900, y: 100 }
        }
      ],
      edges: [
        { source: 'zendesk_webhook', target: 'fetch_ticket_data' },
        { source: 'fetch_ticket_data', target: 'fetch_requester_data' },
        { source: 'fetch_requester_data', target: 'extract_identifiers' },
        { source: 'extract_identifiers', target: 'filter_high_confidence' },
        { source: 'filter_high_confidence', target: 'search_24go_users' },
        { source: 'filter_high_confidence', target: 'search_by_name_dob' },
        { source: 'search_24go_users', target: 'consolidate_user_data' },
        { source: 'search_by_name_dob', target: 'consolidate_user_data' },
        { source: 'consolidate_user_data', target: 'classify_ticket' },
        { source: 'classify_ticket', target: 'update_ticket' },
        { source: 'update_ticket', target: 'determine_response' },
        { source: 'determine_response', target: 'account_access_template', label: 'Account Access' },
        { source: 'determine_response', target: 'billing_template', label: 'Billing Issue' },
        { source: 'determine_response', target: 'tech_support_template', label: 'Technical Support' },
        { source: 'determine_response', target: 'general_template', label: 'Default' },
        { source: 'account_access_template', target: 'add_response_comment' },
        { source: 'billing_template', target: 'add_response_comment' },
        { source: 'tech_support_template', target: 'add_response_comment' },
        { source: 'general_template', target: 'add_response_comment' },
        { source: 'add_response_comment', target: 'send_notification' }
      ]
    },
    is_active: true,
    created_int: 1700000000,
    updated_int: 1700000000
  },

];
