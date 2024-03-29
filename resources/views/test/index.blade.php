@extends('layout')

@section('content')
    <div class="container mt-4">
        <h1>Posts</h1>
        <div class="table-responsive mt-3">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                @foreach($posts as $post)
                    <tr>
                        <td>{{ $post['title'] }}</td>
                        <td>{{ $post['body'] }}</td>
                        <td>
                            <div class="d-flex">
                                <a href="" class="btn btn-sm btn-primary me-2">
                                    <i class="bi bi-pencil"></i>
                                </a>
                                <form method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endsection