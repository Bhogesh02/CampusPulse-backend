class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    registerSuperAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerSuperAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    registerStudent = async (req, res) => {
        try {
            const result = await this.authService.registerStudent(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    registerHostelAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerHostelAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    registerMessAdmin = async (req, res) => {
        try {
            const result = await this.authService.registerMessAdmin(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    login = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const result = await this.authService.loginUser(email, password, role);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };
}

module.exports = AuthController;
