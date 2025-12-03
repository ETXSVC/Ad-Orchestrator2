import { Sparkles } from 'lucide-react';

export default function AIWorkspace() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title flex items-center gap-sm">
                    <Sparkles size={32} />
                    AI Workspace
                </h1>
                <p className="page-subtitle">Generate ad content with AI</p>
            </div>
            <div className="grid grid-2">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-md">Generate Text</h2>
                    <p className="text-sm text-gray-600 mb-lg">Create compelling ad copy with AI</p>
                    <button className="btn btn-primary">Generate Ad Copy</button>
                </div>
                <div className="card">
                    <h2 className="text-xl font-semibold mb-md">Generate Image</h2>
                    <p className="text-sm text-gray-600 mb-lg">Create stunning ad visuals with DALL-E</p>
                    <button className="btn btn-primary">Generate Image</button>
                </div>
            </div>
        </div>
    );
}
