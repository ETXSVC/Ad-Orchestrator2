export default function Settings() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your application</p>
            </div>
            <div className="grid grid-2">
                <div className="card">
                    <h3 className="font-semibold mb-md">General Settings</h3>
                    <p className="text-sm text-gray-600">System configuration and preferences</p>
                </div>
                <div className="card">
                    <h3 className="font-semibold mb-md">AI Configuration</h3>
                    <p className="text-sm text-gray-600">Configure AI models and parameters</p>
                </div>
            </div>
        </div>
    );
}
