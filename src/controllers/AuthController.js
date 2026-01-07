class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    // Helper to format error messages
    formatError(error) {
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
        }
        return error.message;
    }

    registerSuperAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerSuperAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: this.formatError(error) });
        }
    };

    registerStudent = async (req, res) => {
        try {
            const result = await this.authService.registerStudent(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: this.formatError(error) });
        }
    };

    registerHostelAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerHostelAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: this.formatError(error) });
        }
    };

    registerMessAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerMessAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: this.formatError(error) });
        }
    };

    login = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const result = await this.authService.loginUser(email, password, role);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: this.formatError(error) });
        }
    };

    forgotPassword = async (req, res) => {
        try {
            const result = await this.authService.forgotPassword(req.body.email);
            res.json(result);
        } catch (error) {
            res.status(404).json({ message: this.formatError(error) });
        }
    };

    resetPassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const result = await this.authService.resetPassword(token, password);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: this.formatError(error) });
        }
    };

    getProfile = async (req, res) => {
        try {
            const result = await this.authService.getProfile(req.user._id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ message: this.formatError(error) });
        }
    };
}

module.exports = AuthController;
