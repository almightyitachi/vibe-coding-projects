import {
  IsEnum, IsInt, IsOptional, IsString, MaxLength, Min,
} from 'class-validator';

export enum Priority { URGENT = 'URGENT', HIGH = 'HIGH', MEDIUM = 'MEDIUM', LOW = 'LOW' }
export enum DesignStage {
  DISCOVERY = 'DISCOVERY', WIREFRAME = 'WIREFRAME', VISUAL = 'VISUAL',
  PROTOTYPE = 'PROTOTYPE', HANDOFF = 'HANDOFF',
}

export class CreateTaskDto {
  @IsString() @MaxLength(200)
  title!: string;

  @IsString() @IsOptional()
  description?: string;

  @IsString()
  projectId!: string;

  @IsString() @IsOptional()
  sprintId?: string;

  @IsString() @IsOptional()
  assigneeId?: string;

  @IsEnum(Priority) @IsOptional()
  priority?: Priority;

  @IsEnum(DesignStage) @IsOptional()
  designStage?: DesignStage;

  @IsInt() @Min(0) @IsOptional()
  points?: number;

  @IsString() @IsOptional()
  figmaUrl?: string;
}
