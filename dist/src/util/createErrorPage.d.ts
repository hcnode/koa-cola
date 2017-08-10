export default function createErrorPage({env, ctx, error, stack, status, code}: {
    env: any;
    ctx: any;
    error: any;
    stack: any;
    status?: number;
    code?: number;
}): void;
