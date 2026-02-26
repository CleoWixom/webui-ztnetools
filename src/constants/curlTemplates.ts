export interface CurlTemplateVars {
  host: string;
  token: string;
  nwid: string;
  nodeId: string;
  memId: string;
}

export type CurlTemplateId =
  | 'curl-status'
  | 'curl-list-nets'
  | 'curl-create-net'
  | 'curl-get-net'
  | 'curl-config-net'
  | 'curl-list-mem'
  | 'curl-auth-mem'
  | 'curl-del-mem';

export type CurlTemplateMap = Record<CurlTemplateId, (cv: (key: keyof CurlTemplateVars) => string) => string>;

export const curlTpls: CurlTemplateMap = {
  'curl-status': (cv) => `<span class="c"># ── Get controller status & Node ID ─────────────</span>\n<span class="p">$</span> <span class="cmd">curl "${cv('host')}/status" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,

  'curl-list-nets': (cv) => `<span class="c"># ── List all managed networks ────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,

  'curl-create-net': (cv) => `<span class="c"># ── Create a new network (auto-generates ID) ─────</span>\n<span class="p">$</span> <span class="cmd">curl -X POST \\\n  "${cv('host')}/controller/network/${cv('nodeId')}______" \\\n  -H "X-ZT1-AUTH: ${cv('token')}" \\\n  -d '{"ipAssignmentPools":[{"ipRangeStart":"192.168.192.1","ipRangeEnd":"192.168.192.254"}],"routes":[{"target":"192.168.192.0/24","via":null}],"v4AssignMode":{"zt":true},"private":true,"name":"my-network"}'</span>`,

  'curl-get-net': (cv) => `<span class="c"># ── Get network details ──────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,

  'curl-config-net': (cv) => `<span class="c"># ── Update network configuration ─────────────────</span>\n<span class="p">$</span> <span class="cmd">curl -X POST \\\n  "${cv('host')}/controller/network/${cv('nwid')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}" \\\n  -d '{"name":"updated-name","private":true,"multicastLimit":32}'</span>\n\n<span class="c"># ── Delete network ────────────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl -X DELETE \\\n  "${cv('host')}/controller/network/${cv('nwid')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,

  'curl-list-mem': (cv) => `<span class="c"># ── List network members ─────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}/member" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>\n\n<span class="c"># ── Get specific member ───────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,

  'curl-auth-mem': (cv) => `<span class="c"># ── Authorize a member ───────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl -X POST \\\n  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}" \\\n  -d '{"authorized":true}'</span>\n\n<span class="c"># ── Deauthorize a member ──────────────────────────</span>\n<span class="p">$</span> <span class="cmd">curl -X POST \\\n  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}" \\\n  -d '{"authorized":false}'</span>`,

  'curl-del-mem': (cv) => `<span class="c"># ⚠ Deauthorize FIRST, then delete ───────────────</span>\n<span class="p">$</span> <span class="cmd">curl -X POST \\\n  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}" \\\n  -d '{"authorized":false}'</span>\n\n<span class="p">$</span> <span class="cmd">curl -X DELETE \\\n  "${cv('host')}/controller/network/${cv('nwid')}/member/${cv('memId')}" \\\n  -H "X-ZT1-AUTH: ${cv('token')}"</span>`,
};
