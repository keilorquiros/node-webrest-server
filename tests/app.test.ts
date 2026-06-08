import { describe, test, expect, jest } from "@jest/globals";

// En ESM nativo, debemos usar unstable_mockModule ANTES de cualquier importación
// del módulo que queremos mockear.
jest.unstable_mockModule("../src/presentation/server", () => ({
  Server: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
  })),
}));

describe("app.test.ts", () => {
  test("should call server with correct arguments", async () => {
    // Importamos dinámicamente para obtener las versiones mockeadas/configuradas
    const { Server } = await import("../src/presentation/server");
    const { envs } = await import("../src/config/envs");

    await import("../src/app");

    expect(Server).toHaveBeenCalled();
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      publicPath: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    });

    // En ESM, el objeto devuelto por el constructor mock se encuentra en 'results'
    const serverInstance = (Server as any).mock.results[0].value;
    expect(serverInstance.start).toHaveBeenCalled();
  });
});
