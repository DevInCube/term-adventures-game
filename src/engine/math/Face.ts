export const Faces = ["top", "right", "bottom", "left"] as const;

export type Face = (typeof Faces)[number];

export class FaceHelper {

    static getNextClockwise(face: Face): Face {
        const index = Faces.indexOf(face);
        const nextFace = Faces[(index + 1) % Faces.length];
        return nextFace;
    }
    
    static getOpposite(face: Face): Face {
        const index = Faces.indexOf(face);
        const nextFace = Faces[(index + 2) % Faces.length];
        return nextFace;
    }
}
